// "use server";

// import { revalidatePath } from "next/cache";

// import User from "../database/models/user.model";
// import { connectToDatabase } from "../database/mongoose";
// import { handleError } from "../utils";

// // CREATE
// export async function createUser(user: CreateUserParams) {
//   try {
//     await connectToDatabase();

//     const newUser = await User.create(user);

//     return JSON.parse(JSON.stringify(newUser));
//   } catch (error) {
//     handleError(error);
//   }
// }

// // READ
// export async function getUserById(userId: string) {
//   try {
//     await connectToDatabase();

//     const user = await User.findOne({ clerkId: userId });

//     if (!user) throw new Error("User not found");

//     return JSON.parse(JSON.stringify(user));
//   } catch (error) {
//     handleError(error);
//   }
// }

// // UPDATE
// export async function updateUser(clerkId: string, user: UpdateUserParams) {
//   try {
//     await connectToDatabase();

//     const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
//       new: true,
//     });

//     if (!updatedUser) throw new Error("User update failed");
    
//     return JSON.parse(JSON.stringify(updatedUser));
//   } catch (error) {
//     handleError(error);
//   }
// }

// // DELETE
// export async function deleteUser(clerkId: string) {
//   try {
//     await connectToDatabase();

//     // Find user to delete
//     const userToDelete = await User.findOne({ clerkId });

//     if (!userToDelete) {
//       throw new Error("User not found");
//     }

//     // Delete user
//     const deletedUser = await User.findByIdAndDelete(userToDelete._id);
//     revalidatePath("/");

//     return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
//   } catch (error) {
//     handleError(error);
//   }
// }

// // USE CREDITS
// export async function updateCredits(userId: string, creditFee: number) {
//   try {
//     await connectToDatabase();

//     const updatedUserCredits = await User.findOneAndUpdate(
//       { _id: userId },
//       { $inc: { creditBalance: creditFee }},
//       { new: true }
//     )

//     if(!updatedUserCredits) throw new Error("User credits update failed");

//     return JSON.parse(JSON.stringify(updatedUserCredits));
//   } catch (error) {
//     handleError(error);
//   }
// }

"use server";

import { revalidatePath } from "next/cache";
import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import { clerkClient } from "@clerk/nextjs/server";

// CREATE USER
export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    // Ensure required fields are present
    const { clerkId, email, username, photo, firstName, lastName } = user;

    if (!clerkId || !email || !username || !photo) {
      throw new Error("Missing required user fields");
    }

    const newUser = await User.create({
      clerkId,
      email,
      username,
      photo,
      firstName: firstName || "",
      lastName: lastName || "",
      creditBalance: 10,
    });

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    return handleError(error);
  }
}

// GET USER BY ID (Auto-create if not found)
export async function getUserById(userId: string) {
  try {
    if (!userId) throw new Error("Missing userId");

    await connectToDatabase();

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      // Fetch from Clerk if not found in DB
      const clerkUser = await clerkClient.users.getUser(userId);

      const email = clerkUser.emailAddresses[0]?.emailAddress;
      const username = clerkUser.username || clerkUser.firstName || "user";
      const photo = clerkUser.imageUrl;

      if (!email || !username || !photo) {
        throw new Error("Incomplete Clerk profile");
      }

      user = await User.create({
        clerkId: clerkUser.id,
        email,
        username,
        photo,
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        creditBalance: 10,
      });
    }

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    return handleError(error);
  }
}

// UPDATE USER
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    if (!clerkId) throw new Error("Missing clerkId");

    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    return handleError(error);
  }
}

// DELETE USER
export async function deleteUser(clerkId: string) {
  try {
    if (!clerkId) throw new Error("Missing clerkId");

    await connectToDatabase();

    const userToDelete = await User.findOne({ clerkId });
    if (!userToDelete) throw new Error("User not found");

    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    return handleError(error);
  }
}

// UPDATE USER CREDITS
export async function updateCredits(userId: string, creditFee: number) {
  try {
    if (!userId) throw new Error("Missing userId");

    await connectToDatabase();

    const updatedUserCredits = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { creditBalance: creditFee } },
      { new: true }
    );

    if (!updatedUserCredits) throw new Error("User credits update failed");

    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error) {
    return handleError(error);
  }
}
