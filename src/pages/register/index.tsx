import RegisterForm from '../../components/organisms/Register/index';

const Register = () => (
  <div className='w-full flex-1 bg-grey-05 min-h-screen flex flex-col mx-auto p-4 md:p-12'>
    <p className='text-2xl mb-4 md:text-4xl font-bold text-mju-primary'>회원가입</p>
    <div className='flex justify-center items-center'>
      <RegisterForm />
    </div>
  </div>
);

export default Register;
