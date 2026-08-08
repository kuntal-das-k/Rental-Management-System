import { Queue, Worker } from 'bullmq';
import { redis, prisma } from '../config';

export let lateFeeQueue: Queue | null = null;

try {
  lateFeeQueue = new Queue('late-fee-queue', { connection: redis });
} catch (err) {
  console.log('Redis offline, skipping BullMQ queue initialization for local fallback.');
}

export async function processOverdueRentals() {
  console.log('⏰ Running automated overdue rentals & late-fee scan...');

  const now = new Date();

  const overdueOrders = await prisma.order.findMany({
    where: {
      state: { in: ['SALES_ORDER', 'PICKED_UP'] },
      scheduled_return_at: { lt: now },
    },
    include: {
      order_items: {
        include: {
          product: {
            include: { late_fee_rules: true },
          },
        },
      },
      invoices: true,
    },
  });

  console.log(`Found ${overdueOrders.length} overdue orders needing processing.`);

  for (const order of overdueOrders) {
    await prisma.order.update({
      where: { id: order.id },
      data: { is_late: true },
    });

    const diffMs = now.getTime() - new Date(order.scheduled_return_at).getTime();
    const overdueDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    let rate = 25;
    for (const item of order.order_items) {
      if (item.product.late_fee_rules && item.product.late_fee_rules.length > 0) {
        rate = item.product.late_fee_rules[0].rate;
        break;
      } else if (item.product.late_fee_per_unit) {
        rate = item.product.late_fee_per_unit;
        break;
      }
    }

    const calculatedFee = overdueDays * rate;
    console.log(`Order ${order.id} is overdue by ${overdueDays} days. Calculated late fee: $${calculatedFee}`);
  }
}

export function startWorker() {
  try {
    const worker = new Worker(
      'late-fee-queue',
      async (job) => {
        if (job.name === 'scan-overdue') {
          await processOverdueRentals();
        }
      },
      { connection: redis }
    );

    worker.on('completed', (job) => {
      console.log(`Job ${job.id} completed successfully.`);
    });

    worker.on('failed', (job, err) => {
      console.error(`Job ${job?.id} failed with error:`, err);
    });

    if (lateFeeQueue) {
      lateFeeQueue.add(
        'scan-overdue',
        {},
        {
          repeat: {
            every: 60000,
          },
        }
      );
    }

    console.log('🚀 BullMQ Worker initialized and listening on late-fee-queue every 60s.');
  } catch (err) {
    console.log('Redis offline, background worker queue running in silent mode.');
  }
}

if (require.main === module) {
  startWorker();
}
