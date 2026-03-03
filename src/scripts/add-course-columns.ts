import 'dotenv/config';
import knex from 'knex';

async function addColumns() {
    console.log('🔍 Adding missing columns to courses table...');

    const db = knex({
        client: 'pg',
        connection: {
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            ssl: { rejectUnauthorized: false },
        },
    });

    try {
        const hasLearnersCount = await db.schema.hasColumn('courses', 'learners_count');
        if (!hasLearnersCount) {
            await db.schema.table('courses', (table) => {
                table.integer('learners_count').defaultTo(0);
            });
            console.log('✅ Added learners_count column');
        } else {
            console.log('ℹ️  learners_count column already exists');
        }

        const hasRating = await db.schema.hasColumn('courses', 'rating');
        if (!hasRating) {
            await db.schema.table('courses', (table) => {
                table.decimal('rating', 3, 1).defaultTo(0);
            });
            console.log('✅ Added rating column');
        } else {
            console.log('ℹ️  rating column already exists');
        }

        console.log('🚀 Database schema updated successfully!');
    } catch (error) {
        console.error('❌ Failed to update schema:', error);
    } finally {
        await db.destroy();
    }
}

addColumns();
