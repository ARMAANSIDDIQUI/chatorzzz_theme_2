const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Fix path for .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const Category = require('../models/Category');
const Product = require('../models/Product');

async function seed() {
    try {
        console.log('--- SEEDING START ---');
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const cats = [
            { name: 'Gummies', slug: 'gummies' },
            { name: 'Chocolates', slug: 'chocolates' },
            { name: 'Hard Candies', slug: 'hard-candies' },
            { name: 'Sour Sweets', slug: 'sour-sweets' },
            { name: 'Lollipops', slug: 'lollipops' }
        ];

        for (const c of cats) {
            const result = await Category.findOneAndUpdate(
                { slug: c.slug },
                c,
                { upsert: true, new: true }
            );
            console.log(`Upserted category: ${result.name}`);
        }

        console.log('Migrating products...');
        const products = await Product.find({});
        for (const p of products) {
            const match = cats.find(c => c.name.toLowerCase() === p.category.toLowerCase());
            if (match && p.category !== match.name) {
                p.category = match.name;
                await p.save();
                console.log(`Updated ${p.name} category to ${match.name}`);
            }
        }

        console.log('--- SEEDING COMPLETE ---');
        process.exit(0);
    } catch (err) {
        console.error('SEEDING FAILED:', err.message);
        process.exit(1);
    }
}

seed();
