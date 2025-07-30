export interface UserResponse {
  id: string;
  tenantId: string;
  email: string;
  role: "admin" | "agent" | "user";
}
