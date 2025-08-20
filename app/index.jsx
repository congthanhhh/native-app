import '../global.css';
import { ScrollView } from "react-native";
import MovieCarousel from '@/components/home/MovieCarousel';
import MovieCard from '@/components/home/MovieCard';
import { SEARCH_TERMS } from '@/api/service/movieService';
import { useHeaderBg } from '@/context/HeaderBgContext';

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

            <MovieCard
                title="Phim hành động"
                searchTerm={SEARCH_TERMS.ACTION}
                maxDisplay={10}
            />

            <MovieCard
                title="Phim mới ra mắt"
                searchTerm={SEARCH_TERMS.NEW_MOVIES}
                maxDisplay={10}
            />

            <MovieCard
                title="Phim nổi bật"
                searchTerm={SEARCH_TERMS.POPULAR}
                maxDisplay={10}
            />
        </ScrollView>
    );
}
