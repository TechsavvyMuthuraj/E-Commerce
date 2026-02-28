// Sanity `product.js` Schema Reference

export default {
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'title', maxLength: 96 },
        },
        {
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Tools', value: 'tools' },
                    { title: 'SaaS', value: 'saas' },
                    { title: 'Plugins', value: 'plugins' },
                    { title: 'Templates', value: 'templates' },
                    { title: 'Bundles', value: 'bundles' }
                ]
            }
        },
        {
            name: 'shortDescription',
            title: 'Short Description',
            type: 'text',
        },
        {
            name: 'longDescription',
            title: 'Long Description',
            type: 'array',
            of: [{ type: 'block' }]
        },
        {
            name: 'features',
            title: 'Features List',
            type: 'array',
            of: [{ type: 'string' }]
        },
        {
            name: 'pricingTiers',
            title: 'Pricing Tiers',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'name', title: 'Tier Name (e.g. Personal/Commercial)', type: 'string' },
                        { name: 'price', title: 'Price (USD)', type: 'number' },
                        { name: 'licenseType', title: 'License Type Code', type: 'string' }
                    ]
                }
            ]
        },
        {
            name: 'mainImage',
            title: 'Main Image',
            type: 'image',
        },
        {
            name: 'screenshots',
            title: 'Screenshots Gallery',
            type: 'array',
            of: [{ type: 'image' }]
        }
    ]
}
