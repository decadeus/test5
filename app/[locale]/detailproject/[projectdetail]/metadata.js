import { POST as generateMetaDescription } from "@/app/api/metaFromProject/route";

export async function generateMetadata({ params }) {
  const projectId = parseInt(params.projectdetail, 10);

  if (isNaN(projectId)) return {};

  try {
    const response = await generateMetaDescription(
      new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({ projectId, langue: params.locale }),
        headers: { "Content-Type": "application/json" },
      })
    );

    const { metaDescription, title } = await response.json();

    return {
      title: title || "Projet immobilier",
      description: metaDescription || "",
    };
  } catch (error) {
    console.error("Erreur lors de la génération de la meta description :", error);
    return {
      title: "Projet immobilier",
      description: "",
    };
  }
}