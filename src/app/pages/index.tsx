import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import PageContainer from "../components/PageContainer/PageContainer";
import PropTypes, { InferProps } from "prop-types";
import C from "../lib/constants";
import { AppContext } from "next/app";
import classNames from "classnames";

const propTypes = {
  appName: PropTypes.string.isRequired,
  appDomain: PropTypes.string.isRequired,
};

const Home = ({ appName, appDomain }: InferProps<typeof propTypes>) => {
  return (
    <PageContainer
      title={appName[0].toUpperCase() + appName.slice(1)}
      description="Homepage"
    >
      <div className="flex flex-col h-full items-center justify-center">
        <div
          className={classNames(
            "text-center select-none rounded-full p-8 bg-blue-100",
            "-rotate-[3deg] text-blue-800 hover:rotate-[5deg]",
            "hover:text-blue-600 hover:bg-blue-200 hover:scale-150",
            "transition duration-[0.5s]"
          )}
        >
          <h1 className="text-6xl opacity-80">Welcome to {appDomain}!</h1>
          <p className="mt-4 italic opacity-80">hover over me...</p>
        </div>
      </div>
    </PageContainer>
  );
};

/**
 * Fetch props during server-side rendering.
 */
export const getServerSideProps: GetServerSideProps = async (context: any) => {
  return {
    props: {
      appName: C.PROJECT_NAME,
      appDomain: C.PROJECT_DOMAIN,
    },
  };
};

Home.propTypes = propTypes;

export default Home;
