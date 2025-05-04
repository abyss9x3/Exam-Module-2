export const MEMBER = "member";
export const HOD = "hod";
export const EXAMOFFICER = "examofficer";
export const EXAMCONTROLLER = "examcontroller";
export const ADMIN = "admin";

export const isUserMember = designation => designation && designation.toLowerCase() === MEMBER;
export const isUserHOD = designation => designation && designation.toLowerCase() === HOD;
export const isUserExamOfficer = designation => designation && designation.toLowerCase() === EXAMOFFICER;
export const isUserExamController = designation => designation && designation.toLowerCase() === EXAMCONTROLLER;
export const isUserAdmin = designation => designation && designation.toLowerCase() === ADMIN;

