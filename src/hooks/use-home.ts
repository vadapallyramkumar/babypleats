"use client";

import { useEffect, useState } from "react";
import {
  listHeroImages,
  listPromotionalMessages,
  listSocialLinks,
} from "@/lib/api/home";
import type {
  HeroImage,
  PromotionalMessage,
  SocialLink,
} from "@/lib/api/types";

type HomeState<T> = {
  data: T;
  loading: boolean;
};

export function useHeroImages(): HomeState<HeroImage[]> {
  const [data, setData] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    listHeroImages()
      .then((items) => {
        if (active) setData(items);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { data, loading };
}

export function usePromotionalMessages(): HomeState<PromotionalMessage[]> {
  const [data, setData] = useState<PromotionalMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    listPromotionalMessages()
      .then((items) => {
        if (active) setData(items);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { data, loading };
}

export function useSocialLinks(): HomeState<SocialLink[]> {
  const [data, setData] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    listSocialLinks()
      .then((items) => {
        if (active) setData(items);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { data, loading };
}
