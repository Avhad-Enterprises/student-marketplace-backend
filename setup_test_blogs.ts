import DB from './src/database';

async function setupTestBlogs() {
  try {
    const testBlogs = [
      {
        id: 777771,
        blog_id: 'BLOG-PUB-001',
        title: 'Published Blog Post',
        content: 'This is a published blog post content.',
        author: 'Admin',
        status: 'published',
        publish_date: new Date(),
        visibility: 'public'
      },
      {
        id: 777772,
        blog_id: 'BLOG-DRF-001',
        title: 'Draft Blog Post',
        content: 'This is a draft blog post content.',
        author: 'Admin',
        status: 'draft',
        visibility: 'private'
      }
    ];

    for (const blog of testBlogs) {
      const exists = await DB('blogs').where({ id: blog.id }).first();
      if (exists) {
        await DB('blogs').where({ id: blog.id }).update(blog);
        console.log(`Updated Blog: ${blog.blog_id}`);
      } else {
        await DB('blogs').insert(blog);
        console.log(`Created Blog: ${blog.blog_id}`);
      }
    }

    console.log('Test blogs setup successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during blogs setup:', error);
    process.exit(1);
  }
}

setupTestBlogs();
