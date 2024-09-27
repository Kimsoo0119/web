import React, { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { WindowSize } from "../constants/const";
import { PlaceApi } from "../apis/place-api";
import BottomSheet from "../components/BottomSheet";
import { Screen } from "../components/Screen";
import { usePlacesWithToilets } from "../hooks/UsePlaceWithToilets";
import BasicPlaceWithToiletItem from "../components/BasicPlaceWithToiletItem";
import { IPlace } from "../apis/interface/place.interface";
import PlaceDetail from "../components/PlaceDetail";
import DummyInput from "../components/DummySearchInput";
import { BackButton } from "../components/BackButton";
import ReactGA from "react-ga4";

declare global {
  interface Window {
    naver: any;
  }
}

class CustomOverlay extends window.naver.maps.OverlayView {
  private _element: HTMLDivElement;
  private _position: any;

  constructor(options: { position: any; content: string }) {
    super();
    this._element = document.createElement("div");
    this._element.style.cssText = `
    position: absolute;
    font-size: 11px;
    font-weight: 700;
    text-align: center;
    white-space: nowrap;
    transform: translate(-50%, 0);
    `;
    this._element.innerHTML = options.content;
    this.setPosition(options.position);
  }

  setPosition(position: any) {
    this._position = position;
    this.draw();
  }

  getPosition() {
    return this._position;
  }

  onAdd() {
    const overlayLayer = this.getPanes().overlayLayer;
    overlayLayer.appendChild(this._element);
  }

  draw() {
    if (!this.getMap()) {
      return;
    }
    const projection = this.getProjection();
    const position = this.getPosition();
    const pixelPosition = projection.fromCoordToOffset(position);
    this._element.style.left = `${pixelPosition.x}px`;
    this._element.style.top = `${pixelPosition.y}px`; // 마커 아래에 위치하도록 조정
  }

  onRemove() {
    this._element.parentNode?.removeChild(this._element);
  }
}

const MainScreen: React.FC = () => {
  const [mapHeight, setMapHeight] = useState(70);
  const mapRef = useRef<any>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [customOverlay, setCustomOverlay] = useState<any>(null);
  const [selectedPlace, setSelectedPlace] = useState<IPlace | null>(null);
  const [mapCenter, setMapCenter] = useState<any>(null);
  const [detailHeight, setDetailHeight] = useState<number | null>(null);

  const { places, loading, error, loadMore, hasMore } = usePlacesWithToilets();

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadMore();
    }
  }, [loading, hasMore, loadMore]);

  useEffect(() => {
    const mapOptions = {
      center: new window.naver.maps.LatLng(37.5418383405057, 127.07066390961),
      zoom: 18,
    };
    mapRef.current = new window.naver.maps.Map("naverMap", mapOptions);
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      const currentCenter = mapRef.current.getCenter();
      window.naver.maps.Event.trigger(mapRef.current, "resize");
      mapRef.current.setCenter(currentCenter);
    }
  }, [mapHeight]);

  useEffect(() => {
    if (mapRef.current && mapCenter) {
      mapRef.current.setCenter(mapCenter);
    }
  }, [mapCenter]);

  const updateMapCenter = useCallback(() => {
    if (mapRef.current) {
      setMapCenter(mapRef.current.getCenter());
    }
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      const listener = window.naver.maps.Event.addListener(
        mapRef.current,
        "dragend",
        updateMapCenter
      );
      return () => {
        window.naver.maps.Event.removeListener(listener);
      };
    }
  }, [updateMapCenter]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !selectedPlace) {
        ReactGA.event({
          category: "Place",
          action: "loadMore",
        });
        handleLoadMore();
      }
    }, options);

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [handleLoadMore, selectedPlace]);

  const handleBottomSheetHeightChange = useCallback((height: number) => {
    const bottomSheetPercentage = (height / WindowSize.height) * 100;
    let newMapHeight = 100 - bottomSheetPercentage;

    if (bottomSheetPercentage <= 20) {
      newMapHeight = 80;
    } else if (bottomSheetPercentage >= 75) {
      newMapHeight = 30;
    }

    setMapHeight(newMapHeight);
  }, []);

  useEffect(() => {
    if (mapRef.current && selectedPlace) {
      // 기존 마커와 오버레이 제거
      markers.forEach((marker) => marker.setMap(null));
      if (customOverlay) customOverlay.setMap(null);

      // 새로운 마커 생성 및 추가
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(selectedPlace.y, selectedPlace.x),
        map: mapRef.current,
      });

      // 커스텀 오버레이 생성
      const overlay = new CustomOverlay({
        position: new window.naver.maps.LatLng(selectedPlace.y, selectedPlace.x),
        content: selectedPlace.name,
      });

      overlay.setMap(mapRef.current);

      setMarkers([marker]);
      setCustomOverlay(overlay);
    }
  }, [selectedPlace]);

  const handlePlaceClick = (place: IPlace) => {
    setSelectedPlace(place);
    // 바텀시트 크기 조정 후 지도 중심 이동
    const placeDetailElement = document.getElementById("bottom-sheet-content");
    if (placeDetailElement) {
      const height = placeDetailElement.offsetHeight;
      setDetailHeight(height * 1.1 + 20);
    }
    if (mapRef.current) {
      mapRef.current.setCenter(new window.naver.maps.LatLng(place.y, place.x));
    }
  };

  useEffect(() => {
    if (selectedPlace) {
      const placeDetailElement = document.getElementById("bottom-sheet-content");

      if (placeDetailElement) {
        const height = placeDetailElement.offsetHeight;
        setDetailHeight(height * 1.1 + 20);
      }
    }
  }, [selectedPlace]);

  const handleCloseDetail = useCallback(() => {
    setSelectedPlace(null);
    // // 스크롤 위치를 맨 위로 초기화
    // if (loadingRef.current) {
    //   loadingRef.current.scrollIntoView({ behavior: "smooth" });
    // }
  }, []);

  return (
    <Screen>
      {selectedPlace && <BackButton onClick={handleCloseDetail} />}
      {!selectedPlace && <DummyInput />}
      <NaverMapDiv id="naverMap" height={mapHeight} />
      <BottomSheet
        isOpen={true}
        onClose={() => {}}
        preventClose={true}
        startHeight={detailHeight || WindowSize.height * 0.3}
        minHeight={WindowSize.height * 0.3}
        maxHeight={
          selectedPlace
            ? Math.min(detailHeight || WindowSize.height * 0.75, WindowSize.height * 0.75)
            : WindowSize.height * 0.75
        }
        onHeightChange={handleBottomSheetHeightChange}
      >
        <BottomSheetContent id="bottom-sheet-content">
          {selectedPlace ? (
            <PlaceDetail place={selectedPlace} onClose={handleCloseDetail} />
          ) : (
            <>
              {places.map((place) => (
                <BasicPlaceWithToiletItem
                  key={place.id}
                  place={place}
                  onClick={() => handlePlaceClick(place)}
                />
              ))}
              {hasMore && (
                <LoadingIndicator ref={loadingRef}>
                  {loading ? "로딩 중..." : "스크롤하여 더 보기"}
                </LoadingIndicator>
              )}
              {error && <ErrorMessage>오류: {error.message}</ErrorMessage>}
            </>
          )}
        </BottomSheetContent>
      </BottomSheet>
    </Screen>
  );
};

export default MainScreen;

const NaverMapDiv = styled.div<{ height: number }>`
  width: 100%;
  height: ${(props) => props.height}%;
`;

const BottomSheetContent = styled.div`
  text-align: left;
  padding: 10px 20px;
  overflow-y: auto;
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 14px;
  color: #666;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  padding: 10px;
`;
