// Step 1: Sanity schema - /schemas/submission.ts

const submission = {
    name: 'submission',
    type: 'document',
    title: 'Artist Submissions',
    fields: [
      {
        name: 'name',
        type: 'string',
        title: 'Name',
      },
      {
        name: 'contact',
        type: 'string',
        title: 'Contact Info',
      },
      {
        name: 'productTitle',
        type: 'string',
        title: 'Product Title',
      },
      {
        name: 'productDescription',
        type: 'text',
        title: 'Product Description',
      },
      {
        name: 'productImage',
        type: 'image',
        title: 'Product Image',
        options: { hotspot: true },
      },
      {
        name: 'submittedAt',
        type: 'datetime',
        title: 'Submitted At',
        initialValue: () => new Date().toISOString(),
      },
    ],
  };

  export default submission;
