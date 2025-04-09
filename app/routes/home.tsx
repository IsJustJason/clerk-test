import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const [testResponse, setTestResponse] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn || !isLoaded) {
      console.log("User is not signed in or auth is not loaded");
      return;
    }

    const fetchTest = async () => {
      try {
        const clerkToken = await getToken();

        if (!clerkToken) {
          console.error("Authentication error. Please try logging in again.");
          return;
        }

        const response = await fetch(`http://localhost:8080/api/test`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${clerkToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching games: ${response.statusText}`);
        }

        const data = await response.json();
        if (data?.message) {
          setTestResponse(data.message);
        }
      } catch (err) {
        console.error("Failed to fetch test:", err);
      }
    };

    fetchTest();
  }, [isSignedIn, isLoaded]);

  // Clear the message if the user signs out
  useEffect(() => {
    if (!isSignedIn) {
      setTestResponse(null);
    }
  }, [isSignedIn]);

  return (
    <>
      {isSignedIn && testResponse && <div>{testResponse}</div>}
      <Welcome />
      <Link to="/test-page">Test Page</Link>
    </>
  );
}
