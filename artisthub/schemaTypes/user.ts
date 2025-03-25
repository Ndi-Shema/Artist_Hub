export default {
    name: "user",
    type: "document",
    title: "User",
    fields: [
      {
        name: "email",
        type: "string",
        title: "Email",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "passwordHash",
        type: "string",
        title: "Hashed Password",
        hidden: true,
      },
      {
        name: "name",
        type: "string",
        title: "Display Name",
      },
      {
        name: "profileImage",
        type: "image",
        title: "Profile Image",
        options: {
          hotspot: true,
        },
      },
    ],
  };
