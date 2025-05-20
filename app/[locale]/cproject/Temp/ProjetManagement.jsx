import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function CollaboratorManager({
  collaborators,
  setCollaborators,
  maxCollaborators,
  newEmail,
  setNewEmail,
  newFirstName,
  setNewFirstName,
  newLastName,
  setNewLastName,
  addCollaborator,
  deleteCollaborator
}) {
  return (
    <Card className="flex-1 shadow-md border border-gray-200">
      <CardContent className="space-y-6 p-6">
        <h2 className="text-2xl font-semibold">
          Collaborateurs ({collaborators.length}/{maxCollaborators})
        </h2>

        <div className="space-y-3">
          {collaborators.map((collab) => (
            <div key={collab.id} className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-md border border-gray-100">
              <span className="text-sm text-gray-700">
                {collab.first_name} {collab.last_name} – {collab.email}
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteCollaborator(collab.id)}
              >
                Supprimer
              </Button>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <Input
            placeholder="Prénom"
            value={newFirstName}
            onChange={(e) => setNewFirstName(e.target.value)}
            disabled={collaborators.length >= maxCollaborators}
          />
          <Input
            placeholder="Nom"
            value={newLastName}
            onChange={(e) => setNewLastName(e.target.value)}
            disabled={collaborators.length >= maxCollaborators}
          />
          <Input
            placeholder="Email du collaborateur"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            disabled={collaborators.length >= maxCollaborators}
          />
          <Button onClick={addCollaborator} disabled={collaborators.length >= maxCollaborators}>
            Ajouter
          </Button>
        </div>

        {collaborators.length >= maxCollaborators && (
          <p className="text-sm text-red-500">Limite de collaborateurs atteinte.</p>
        )}
      </CardContent>
    </Card>
  );
}
