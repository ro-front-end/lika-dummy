import "./App.css";
import CardsContainer from "./components/cardsContainer";
import Footer from "./components/footer";
import Header from "./components/header";

function App() {
  return (
    <div className="bg-[#f6f6f6] min-h-screen w-full grid grid-rows-[auto_1fr_auto]">
      <Header />
      <main className="flex justify-center items-center">
        <CardsContainer />
      </main>
      <Footer />
    </div>
  );
}

export default App;
