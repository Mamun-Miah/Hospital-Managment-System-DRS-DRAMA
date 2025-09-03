import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
export async function GET( ){
    const session = await getServerSession(authOptions)

   if (!session?.user.permissions?.includes("create-role")){
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

    try{
        const getPermission = await prisma.role.findMany(
            
    )
    return NextResponse.json(getPermission);
    } catch(err){
        console.log(err)
        return NextResponse.json(err)
    }
    

    
}