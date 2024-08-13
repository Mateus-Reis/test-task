import Header from "../components/Header";
import Presentation from "../components/Presentation";
import UserList from "../components/UserList";
import SignUpForm from "../components/SignUpForm";

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <Presentation />
      <UserList />
      <SignUpForm />
    </>
  );
};

export default Home;
