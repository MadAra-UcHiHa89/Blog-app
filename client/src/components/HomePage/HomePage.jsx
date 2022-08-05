import React from "react";
import poster from "../../assets/img/poster.png";

const HomePage = () => {
  return (
    <>
      <section className="pb-10 bg-gray-800">
        <div className="relative container px-4   mx-auto">
          <div className="flex flex-wrap items-center -mx-4 mb-10 2xl:mb-14">
            <div className="w-full lg:w-1/2 px-4 mb-16 lg:mb-0">
              <span className="text-lg font-bold text-blue-400">
                Create posts to educate
              </span>
              <h2 className="max-w-2xl mt-12 mb-12 text-6xl 2xl:text-8xl text-white font-bold font-heading">
                Pen down your ideas{" "}
                <span className="text-yellow-500">By creating a post</span>
              </h2>
              <p className="mb-12 lg:mb-16 2xl:mb-24 text-xl text-gray-100">
                Your post must be free from racism and unhealthy words
              </p>
              <a
                className="inline-block px-12 py-5 text-lg text-white font-bold bg-blue-500 hover:bg-blue-600 rounded-full transition duration-200"
                href="/"
              >
                Buy This Course
              </a>
            </div>
            <div className="w-full lg:w-1/2 px-4">
              <img className="w-full" src={poster} alt={poster} />
            </div>
          </div>
        </div>
      </section>
    </>
    // <>
    //   <div className="bg-[#1F2937] w-[100vw] h-[100vh]">
    //     <div className="max-w-[1640px] mx-auto h-[100vh] w-full md:w-9/12 xl:w-8/12 flex flex-row items-center justify-between px-4 py-4 ">
    //       <div className="md:basis-[60%] h-[100%] flex flex-col justify-center gap-10">
    //         <p className="text-lg font-semibold text-blue-400">
    //           Create posts to educate
    //         </p>
    //         <div>
    //           <h3 className="font-bold text-white text-7xl">
    //             Pen down your
    //             <br />
    //             ideas <span className="text-yellow-500">By</span>
    //             <br />
    //             <span className="text-yellow-500"> creating a post</span>
    //           </h3>
    //         </div>
    //         <p className="text-md text-white">
    //           Your post must be free from racism d unhealthy words
    //         </p>
    //         <button className=" lg:w-1/2 font-bold bg-[#267EF2] px-4 py-4 rounded-full text-white">
    //           Buy This Course
    //         </button>
    //       </div>
    //       <div className="md:basis-[50%] ">
    //         <img
    //           className="w-[100%]   object-cover"
    //           src={poster}
    //           alt="poster"
    //         />
    //       </div>
    //     </div>
    //   </div>
    // </>
  );
};

export default HomePage;

//  <>
//       <div className="bg-[#1F2937] w-[100vw] h-[100vh]">
//         <div className="max-w-[1640px] mx-auto h-[100vh] w-full md:w-9/12 xl:w-8/12 flex flex-row items-center justify-between px-4 py-4 ">
//           <div className="md:basis-[60%] h-[100%] flex flex-col justify-center gap-10">
//             <p className="text-lg font-semibold text-blue-400">
//               Create posts to educate
//             </p>
//             <div>
//               <h3 className="font-bold text-white text-7xl">
//                 Pen down your
//                 <br />
//                 ideas <span className="text-yellow-500">By</span>
//                 <br />
//                 <span className="text-yellow-500"> creating a post</span>
//               </h3>
//             </div>
//             <p className="text-md text-white">
//               Your post must be free from racism d unhealthy words
//             </p>
//             <button className=" lg:w-1/2 font-bold bg-[#267EF2] px-4 py-4 rounded-full text-white">
//               Buy This Course
//             </button>
//           </div>
//           <div className="md:basis-[50%] ">
//             <img
//               className="w-[100%]   object-cover"
//               src={poster}
//               alt="poster"
//             />
//           </div>
//         </div>
//       </div>
//     </>
//   );
