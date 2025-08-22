import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET( ){

    try{
        const getPermission = await prisma.role.findMany(
            
    )
    return NextResponse.json(getPermission);
    } catch(err){
        console.log(err)
        return NextResponse.json(err)
    }
    

    
}