import { useQuery } from "@tanstack/react-query";

export const fetchTeams = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/teamTabel`,
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const fetchTasks = async (teamMemberId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/fetchTask?id=${teamMemberId}`,
  );
  if (!response.ok) {
    throw new Error("Newwork response was not ok");
  }
  return response.json();
};

export const fetchAtten = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/fetchAtten?id=${id}`,
  );
  if (!response.ok) {
    throw new Error("Newwork response was not ok");
  }
  return response.json();
};

export const fetchMemberId = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/fetchProfile?id=${id}`,
  );
  if (!response.ok) {
    throw new Error("Newwork response was not ok");
  }
  return response.json();
};

export async function FetchTeam() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/fetchDash`,
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export const getProfileTeamById = async (userId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/getProfileTeamById?id=${userId}`, // ลบปีกกาออกจาก URL
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
