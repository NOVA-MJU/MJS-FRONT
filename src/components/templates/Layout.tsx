import Footer from '../organisms/Footer';
import Navbar from '../organisms/Navbar';
import { Outlet } from 'react-router-dom';

interface LayoutProps {
  className?: string;
}

const Layout = ({ className }: LayoutProps) => {
  return (
    <div
      className={`
        min-h-screen w-full flex flex-col justify-center items-center overflow-x-auto
        ${className}
        `}
    >
      <Navbar />
      {/**
       * 부연 설명을 덧붙이자면....
       * 여기서 flex-1 속성은 사실상 h-full 과 비슷한 역할을 하게됩니다. 이런 상황에서는 부모 태그가 flex-col 즉, 수직 방향으로 flex박스를 형성하고 있으므로 높이값을 계산할 수 없기 때문에 h-full은 동작하지 않게됩니다.
       * 그래서 flex박스에서 flex-direction 축에 대한 상대 크기(여기서는 height)를 지정할 때에는 h-full이 아닌 flex-1을 사용해야합니다.
       * flex-1 속성은 부모 flex박스의 남은 공간 전체를 차지하라는 의미와 같습니다. (정확히 설명하면 부모 flex박스의 1만큼의 비율(weight)을 차지하라는 의미입니다.)
       * 비슷하게 활용하자면 flex-1/2 를 두 자식 태그에게 부여하면 각각 flex-direction 축에 대해 남은 공간의 1/2비율씩 차지하라는 의미가 됩니다.
       * 반응형 웹을 만들기 위해 (스스로 공간을 차지했다가 줄어들었다가) 웹사이트를 유연하게 만드려면 flex박스의 사용 비중이 많아질 수 밖에 없으니 잘 활용합시다.
       * 성능 오버헤드는 크지않으니 걱정하지말고 많이 사용하세요.
       */}
      <main className='w-full flex-1 md:w-[1280px] h-auto mx-auto flex flex-col'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
