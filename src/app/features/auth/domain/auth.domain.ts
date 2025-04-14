import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root',

})
export abstract class SignupUseCase {
    abstract signup(email: string): Observable<any>;
    abstract createProfile(email: string, userName: string, passWord: string): Observable<any>;
    abstract login(email: string, passWord: string): Observable<any>;
}


@Injectable({
    providedIn: 'root'
})
export abstract class OtpUseCase {

    abstract resendOtp(email: string): Observable<any>;
    abstract validateOtp(email: string, otp: string): Observable<any>;

}

export interface AuthResponse {
    token: string;
    status: boolean;
    user: User,
    workSpace: Workspace
}


export interface User {
    name: string;
    profileUrl: string;
    email: string;
    plan: string;
    role: string;
    workSpaces: Array<string>;
}

export interface Workspace {
    name: string;
    owner: string;
    isDefault: boolean;
    members: Array<string>;
}