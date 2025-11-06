import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const publicRoutes = ["/login", "/register"];
export async function proxy(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);


	if (!sessionCookie) {
		if (publicRoutes.includes(request.nextUrl.pathname)) {
			return NextResponse.next();
		}
		return NextResponse.redirect(new URL("/login", request.url));
	}

    if(sessionCookie && publicRoutes.includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard", "/login", "/register"], // Specify the routes the middleware applies to
};