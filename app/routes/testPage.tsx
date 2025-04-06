import type { Route } from "./+types/testPage";
import { Link } from "react-router";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Test Page" },
    { name: "description", content: "Test Page" },
  ];
}

export default function TestPage() {
  return (<>
    <div>Test Page</div>
    <Link to="/">Home</Link>
  </>);
}
