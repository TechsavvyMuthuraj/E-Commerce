// Sanity `post.js` Schema — Blog Post
// Add this to your Sanity Studio schemas/index.js alongside the product schema

export default {
    name: 'post',
    title: 'Blog Post',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Post Title',
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
                    { title: 'Windows Tips', value: 'Windows Tips' },
                    { title: 'Optimization Guides', value: 'Optimization Guides' },
                    { title: 'Privacy & Security', value: 'Privacy & Security' },
                    { title: 'Gaming Performance', value: 'Gaming Performance' },
                    { title: 'Product Updates', value: 'Product Updates' },
                    { title: 'Tutorials', value: 'Tutorials' },
                ]
            }
        },
        {
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
            description: 'Short summary shown on the blog listing page',
        },
        {
            name: 'body',
            title: 'Body',
            type: 'text',
            description: 'Full article content',
        },
        {
            name: 'readTime',
            title: 'Read Time',
            type: 'string',
            description: 'e.g. 5 min read',
        },
        {
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
        },
        {
            name: 'mainImage',
            title: 'Cover Image',
            type: 'image',
        },
    ]
};
