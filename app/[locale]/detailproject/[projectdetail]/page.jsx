// export { generateMetadata } from "./metadata";
import ListProjectPage from "./ListProjectPage";
import { createClient } from "@/utils/supabase/server";

export default function ProjectPage({ params }) {
  return <ListProjectPage projectdetail={params.projectdetail} />;
}
