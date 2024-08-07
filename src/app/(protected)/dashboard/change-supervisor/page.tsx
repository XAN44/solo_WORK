"use client";
import { useEffect, useState } from "react";

interface Supervisor {
  id: string;
  username: string;
}

function ChangeSupervisor() {
  const [currentSupervisorList, setCurrentSupervisorList] = useState<
    Supervisor[]
  >([]);
  const [newSupervisorList, setNewSupervisorList] = useState<Supervisor[]>([]);
  const [selectedCurrentSupervisor, setSelectedCurrentSupervisor] =
    useState<string>("");
  const [selectedNewSupervisor, setSelectedNewSupervisor] =
    useState<string>("");

  useEffect(() => {
    const fetchSupervisors = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/get-supervisor`,
      );
      const data = await response.json();
      setCurrentSupervisorList(data.currentSupervisors || []);
      setNewSupervisorList(data.newSupervisors || []);
    };

    fetchSupervisors();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/supervisorChange`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentSupervisorId: selectedCurrentSupervisor,
          newSupervisorId: selectedNewSupervisor,
        }),
      },
    );

    if (response.ok) {
      alert("Supervisor updated successfully");
    } else {
      alert("Failed to update supervisor");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Change Supervisor</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div>
          <label
            htmlFor="currentSupervisor"
            className="block text-sm font-medium text-gray-700"
          >
            Current Supervisor
          </label>
          <select
            id="currentSupervisor"
            value={selectedCurrentSupervisor}
            onChange={(e) => setSelectedCurrentSupervisor(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm"
            required
          >
            <option value="">Select current supervisor</option>
            {currentSupervisorList.map((supervisor) => (
              <option key={supervisor.id} value={supervisor.id}>
                {supervisor.username}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <label
            htmlFor="newSupervisor"
            className="block text-sm font-medium text-gray-700"
          >
            New Supervisor
          </label>
          <select
            id="newSupervisor"
            value={selectedNewSupervisor}
            onChange={(e) => setSelectedNewSupervisor(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm"
            required
          >
            <option value="">Select new supervisor</option>
            {newSupervisorList.map((supervisor) => (
              <option key={supervisor.id} value={supervisor.id}>
                {supervisor.username}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Update Supervisor
        </button>
      </form>
    </div>
  );
}

export default ChangeSupervisor;
