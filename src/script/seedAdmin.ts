import { prisma } from "../lib/prisma";

async function seedAdmin() {
  console.log("running seedAdmin");
  try {
    const adminData = {
      name: "Admin",
      email: "admin@admin.com",
      role: "ADMIN",
      password: "admin@com",
    };
    // check already exists
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });
    if (existingAdmin) {
      console.log("Admin already exists. Skipping seeding.");
      return;
    }
    const adminRegister = await fetch(
      `${process.env.BETTER_AUTH_URL}/api/auth/sign-up/email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: process.env.CLIENT_URL as string,
        },
        body: JSON.stringify(adminData),
      }
    );
    if (adminRegister.ok) {
      await prisma.user.updateMany({
        where: { email: adminData.email },
        data: { emailVerified: true },
      });
      console.log("admin create success");
    }
  } catch (error) {
    console.log(error);
  }
}

seedAdmin();
