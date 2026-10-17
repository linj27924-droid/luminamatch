export type InvitationStatus = "pending" | "accepted" | "declined" | "expired";

export interface CollaborationInvite {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "model" | "photographer" | "client";
  recipientId: string;
  recipientName: string;
  recipientRole: "model" | "photographer" | "client";
  projectTitle: string;
  proposedDate: string;
  proposedBudget: string;
  message: string;
  status: InvitationStatus;
  createdAt: string;
  updatedAt: string;
  collabRoomId?: string;
}