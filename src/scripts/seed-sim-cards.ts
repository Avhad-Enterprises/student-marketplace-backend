import DB from "@/database";
import { logger } from "@/utils/logger";

async function seedSimCards() {
    try {
        logger.info("Seeding SIM cards...");

        const sims = [
            {
                sim_id: 'SIM-8234',
                provider_name: 'Airalo',
                service_name: 'Global eSIM - 5GB',
                countries_covered: 195,
                status: 'active',
                student_visible: true,
                network_type: '4G/5G',
                data_allowance: '5GB',
                validity: '30 days',
                popularity: 4567
            },
            {
                sim_id: 'SIM-8235',
                provider_name: 'Holafly',
                service_name: 'Unlimited Europe eSIM',
                countries_covered: 32,
                status: 'active',
                student_visible: true,
                network_type: '4G/5G',
                data_allowance: 'Unlimited',
                validity: '15 days',
                popularity: 3421
            },
            {
                sim_id: 'SIM-8236',
                provider_name: 'SimOptions',
                service_name: 'USA Student Plan',
                countries_covered: 1,
                status: 'active',
                student_visible: true,
                network_type: '5G',
                data_allowance: '10GB',
                validity: '30 days',
                popularity: 2845
            },
            {
                sim_id: 'SIM-8237',
                provider_name: 'GigSky',
                service_name: 'Asia Pacific Bundle',
                countries_covered: 28,
                status: 'active',
                student_visible: false,
                network_type: '4G',
                data_allowance: '3GB',
                validity: '30 days',
                popularity: 1256
            },
            {
                sim_id: 'SIM-8238',
                provider_name: 'Truphone',
                service_name: 'UK & Europe Data',
                countries_covered: 42,
                status: 'inactive',
                student_visible: false,
                network_type: '4G/5G',
                data_allowance: '8GB',
                validity: '60 days',
                popularity: 987
            },
        ];

        for (const sim of sims) {
            await DB('sim_cards')
                .insert(sim)
                .onConflict('sim_id')
                .merge();
        }

        logger.info("SIM cards seeded successfully!");
        process.exit(0);
    } catch (err) {
        logger.error("Error seeding SIM cards:", err);
        process.exit(1);
    }
}

seedSimCards();
