const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Product = require('../models/Product');

async function migrate() {
    try {
        console.log('--- SLUG MIGRATION START ---');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find({});
        console.log(`Found ${products.length} products to migrate.`);

        for (const p of products) {
            if (!p.slug) {
                p.slug = p.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                // Ensure uniqueness if multiple products have same name
                let uniqueSlug = p.slug;
                let counter = 1;
                while (await Product.findOne({ slug: uniqueSlug, _id: { $ne: p._id } })) {
                    uniqueSlug = `${p.slug}-${counter}`;
                    counter++;
                }
                p.slug = uniqueSlug;
                await p.save();
                console.log(`Updated product: ${p.name} -> ${p.slug}`);
            } else {
                console.log(`Skipping (already has slug): ${p.name}`);
            }
        }

        console.log('--- SLUG MIGRATION COMPLETE ---');
        process.exit(0);
    } catch (err) {
        console.error('MIGRATION FAILED:', err.message);
        process.exit(1);
    }
}

migrate();
