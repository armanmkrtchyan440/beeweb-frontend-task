import { fetchMe } from "@/$api";

export default async function WorkspacesPage() {
  const user = await fetchMe();

  return (
    <div>
      <h2 className="text-2xl md:text-5xl lg:text-6xl text-center font-bold">
        Hello {user.fullName}
      </h2>
    </div>
  );
}
