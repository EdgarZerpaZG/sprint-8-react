import T1 from '../components/utils/tOne'
import T2 from '../components/utils/tTwo'

export default function Home() {
  return (
    <>
        <main className="flex justify-center items-center h-full">
            <section>
                <T1 style="text-center text-3xl font-bold underline pb-5 text-amber-300" title='Dashborad APP' />
                <T2 style="text-center text-xl text-amber-300" title='A project using Vite, React, TypeScript, Tailwind CSS, Supabase and MongoDB' />
            </section>
        </main>
    </>
  )
}