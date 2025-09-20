export type NotificationKind = "info" | "success" | "warning" | "error";


export type NotificationItem = {
id: string;
title: string;
body?: string;
kind: NotificationKind;
createdAt: string; // ISO string
readAt?: string | null;
actionUrl?: string; // optional deep link
};