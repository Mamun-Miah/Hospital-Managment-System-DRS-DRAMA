import { NextRequest, NextResponse } from "next/server";

export async function POST (req:NextRequest){
    const data = await req.json()

    // const userRoleName = data.name;
    // const userRolePermission = data.permissionId;

 
    return NextResponse.json(data);
}