export const MEMBER = "member";
export const HOD = "hod";
export const EXAMOFFICER = "examofficer";
export const EXAMCONTROLLER = "examcontroller";
export const ADMIN = "admin";

export const isUserMember = designation => designation === MEMBER;
export const isUserHOD = designation => designation === HOD;
export const isUserExamOfficer = designation => designation === EXAMOFFICER;
export const isUserExamController = designation => designation === EXAMCONTROLLER;
export const isUserAdmin = designation => designation === ADMIN;

