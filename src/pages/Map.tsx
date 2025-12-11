import GoogleMapComponent from "../components/map/map";

export default function Map(){
    return(
        <>
            <main className="h-full">
                <section className="w-full">
                    <GoogleMapComponent />
                </section>
            </main>
        </>
    )
}