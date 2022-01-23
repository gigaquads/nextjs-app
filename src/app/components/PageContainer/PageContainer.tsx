import Head from "next/head";
import PropTypes, { InferProps } from "prop-types";

function PageContainer({
  title,
  description,
  children,
}: InferProps<typeof PageContainer.propTypes>) {
  return (
    <div className="PageContainer w-full h-[100vh]">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-[100%]">{children}</div>
      <style jsx>{`
        // TODO: define module styles
        .PageContainer {
        }
      `}</style>
    </div>
  );
}

PageContainer.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.any,
};

export default PageContainer;
