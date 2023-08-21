import { createContext, useEffect, useState } from "react";
import { createClient } from '@sanity/client';

export const Context = createContext({
  items: [],
});

// propsokon keresztül áthozott sztétek
export function CartProvider({
  data,
  children,
  setPictures,
  setCVDatas,
  setPosts
}) {

  // fetcheléshez szükséges adatok
  const client = createClient({
    projectId: window.env.PROJECT_ID_PORTFOLIO,
    dataset: window.env.DATASET_PORTFOLIO,
    apiVersion: '2021-10-21',
    useCdn: true,
    token: window.env.TOKEN,
    ignoreBrowserTokenWarning: true,
  })

   //fetchelése a posztokhoz adatokhoz gyűjteményeknek
   useEffect(() => {
    let isMounted = true; // Flag to track component mount status

    client
      .fetch(`*[_type == "post"]`)
      .then((data) => {
        if (isMounted) {
          setPosts(data);
        }
      })
      .catch(console.error);

    return () => {
      isMounted = false; // Set flag to false when the component is unmounted
    };
  }, []);
  
  //fetchelése az önéletrajzi adatokhoz gyűjteményeknek
  useEffect(() => {
    let isMounted = true; // Flag to track component mount status

    client
      .fetch(`*[_type == "cv"]`)
      .then((data) => {
        if (isMounted) {
          setCVDatas(data);
        }
      })
      .catch(console.error);

    return () => {
      isMounted = false; // Set flag to false when the component is unmounted
    };
  }, []);
  
  
  //fetchelése a kép gyűjteményeknek
  useEffect(() => {
    let isMounted = true; // Flag to track component mount status

    client
      .fetch(`*[_type == "pictures"]`)
      .then((data) => {
        if (isMounted) {
          setPictures(data);
        }
      })
      .catch(console.error);

    return () => {
      isMounted = false; // Set flag to false when the component is unmounted
    };
  }, []);


  //fogalmam sincs mi de kell
  const contextValue = {
    items: data,
  }

  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  )
}

export default CartProvider;