import '../global.css';
import { ScrollView } from "react-native";
import MovieCarousel from '@/components/home/MovieCarousel';
import MovieCard from '@/components/home/MovieCard';


const hotMovies = [
    { id: 1, title: "Phụ Quân Đại Nhân", poster: "https://picsum.photos/200/300?random=1" },
    { id: 2, title: "Dự Khanh Hành", poster: "https://picsum.photos/200/300?random=2" },
    { id: 3, title: "Ngã Cha", poster: "https://picsum.photos/200/300?random=3" },
    { id: 4, title: "Movie 4", poster: "https://picsum.photos/200/300?random=4" },
    { id: 5, title: "Movie 5", poster: "https://picsum.photos/200/300?random=5" },
    { id: 6, title: "Movie 6", poster: "https://picsum.photos/200/300?random=6" },
    { id: 7, title: "Movie 7", poster: "https://picsum.photos/200/300?random=7" },
    { id: 8, title: "Movie 8", poster: "https://picsum.photos/200/300?random=8" },
];

const popularMovies = [
    { id: 9, title: "Lông Vũ Đen: Điệu Múa Của Geisha", poster: "https://picsum.photos/200/300?random=9" },
    { id: 10, title: "Gangster Vô Danh", poster: "https://picsum.photos/200/300?random=10" },
    { id: 11, title: "Vú Tí", poster: "https://picsum.photos/200/300?random=11" },
];

const continueWatching = [
    { id: 12, title: "Movie A", poster: "https://picsum.photos/200/300?random=12" },
    { id: 13, title: "Movie B", poster: "https://picsum.photos/200/300?random=13" },
];

export default function HomeScreen() {
    return (
        <ScrollView className="flex-1 bg-netflix-black">
            <MovieCarousel />

            <MovieCard
                title="Phim mới ra mắt"
                movies={continueWatching}
            />

            <MovieCard
                title="Phim ngắn - Xem là yêu"
                movies={hotMovies}
            />

            <MovieCard
                title="Phim lẻ nổi bật"
                movies={popularMovies}
            />
        </ScrollView>
    );
}
