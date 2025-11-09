import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

const publicRoutes = ["/","/login", "/register", "/reset-password", "/forgot-password"];
export async function proxy(request: NextRequest) {
	const session = await auth.api.getSession({
		headers: await headers
		()
	})
	if(session) {
		if(publicRoutes.includes(request.nextUrl.pathname)) {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}
		return NextResponse.next();
	}
	if(!session && !publicRoutes.includes(request.nextUrl.pathname)) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/", "/dashboard", "/login", "/register", "/reset-password", "/forgot-password"], // Specify the routes the middleware applies to
};