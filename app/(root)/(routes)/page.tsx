import Todos from '@/components/Scheduling/Todo/Todo';
import { getTasks } from '@/lib/serv-actions/Todo';
import { SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton } from '@clerk/nextjs';

const RootPage = async () => {
  const tasks = await getTasks();


  return (
    <div>
      <SignedIn>
      <Todos initTasks={tasks} />
      </SignedIn>
      <SignedOut>
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-8">What this app is about</h1>
            <p className="text-lg mb-8">This is a learning app that offers AI-induced learning and spatial mapping of notes.</p>
            <div className="flex space-x-4">
              <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" >
                <SignInButton />
              </div>
              <div className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                <SignUpButton  />
              </div>
            </div>
          </div>
        </div>
      </SignedOut>
    </div>
  );
};

export default RootPage;