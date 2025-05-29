import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../../../core/domain/entities/user.model";


@Injectable({
    providedIn: 'root',

})
export abstract class RegisterUseCase {
    abstract signup(email: string): Observable<any>;
    abstract createCompany(email: string, companyName: string, passWord: string): Observable<any>;
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
    token?: string;
    status: boolean;
    user: User;
    forceChangePassword?: boolean;
}