import '../global.css';
import { ScrollView } from "react-native";
import MovieCarousel from '@/components/home/MovieCarousel';
import MovieCard from '@/components/home/MovieCard';
import { useHeaderBg } from '@/context/HeaderBgContext';
import { SEARCH_TERMS, TYPE_MOVIE, TYPE_SERIES } from '@/const/OMDbapi';

export default function HomeScreen() {
    const { setHeaderBgColor } = useHeaderBg();

    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY > 50) {
            setHeaderBgColor('#141414'); // Màu khi scroll xuống
        } else {
            setHeaderBgColor('transparent'); // Màu khi ở top
        }
    };

    return (
        <ScrollView
            onScroll={handleScroll}
            scrollEventThrottle={16}
            className="flex-1 bg-netflix-black"
        >
            <MovieCarousel />
            {/* 
            <MovieCard
                title="Phim hành động"
                searchTerm={SEARCH_TERMS.ACTION}
                typeCategory={TYPE_MOVIE}
            />

            <MovieCard
                title="Phim mới ra mắt"
                searchTerm={SEARCH_TERMS.NEW_MOVIES}
                typeCategory={TYPE_MOVIE}
            />

            <MovieCard
                title="Phim Disney"
                searchTerm={SEARCH_TERMS.DISNEY}
                typeCategory={TYPE_MOVIE}
            /> */}

            <MovieCard
                title="Phim nổi bật"
                searchTerm={SEARCH_TERMS.NEW_MOVIES}
                typeCategory={TYPE_MOVIE}
            />
            <MovieCard
                title="Series Hot"
                searchTerm={SEARCH_TERMS.COMEDY}
                typeCategory={TYPE_SERIES}
            />

        </ScrollView>
    );
}
