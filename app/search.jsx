import { View, Text } from "react-native";
import { useState } from "react";
import { Input, InputField, InputIcon } from "@/components/ui/input";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Heading } from "@/components/ui/heading";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import {
  Button,
  ButtonText,
  ButtonSpinner,
  ButtonIcon,
  ButtonGroup,
} from "@/components/ui/button";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Search() {
  const [showCards, setShowCards] = useState(false);
  return (
    <SafeAreaView className="flex-1 px-4 pt-20 bg-netflix-black w-full">
      <Input
        className="w-full h-12 bg-gray-50/10"
        variant="outline"
        isDisabled={false}
        isInvalid={false}
        isReadOnly={false}
      >
        <InputField
          className="text-white font-bold"
          placeholder="Search"
          onFocus={() => setShowCards(true)}
          onBlur={() => setShowCards(false)}
        />
        <Ionicons name="search" size={24} color="#fff" className="m-2" />
      </Input>

      {showCards && (
        <>
          <Card size="md" variant="filled" className="bg-black">
            <View className="flex-row items-center">
              <Image
                source={require("../assets/meow.jpg")}
                className="w-32 h-20 rounded mr-3 bg-gray-300"
                alt="meow"
              />
              <View className="flex-1">
                <Heading size="md" className="mb-1 text-white">
                  Meow Warriors
                </Heading>
              </View>
              <Ionicons name="play" size={28} color="#fff" className="ml-2" />
            </View>
          </Card>
          <Card size="md" variant="filled" className="bg-black">
            <View className="flex-row items-center">
              <Image
                source={require("../assets/meow.jpg")}
                className="w-32 h-20 rounded mr-3 bg-gray-300"
                alt="meow"
              />
              <View className="flex-1">
                <Heading size="md" className="mb-1 text-white">
                  Meow Warriors
                </Heading>
              </View>
              <Ionicons name="play" size={28} color="#fff" className="ml-2" />
            </View>
          </Card>
          <Card size="md" variant="filled" className="bg-black">
            <View className="flex-row items-center">
              <Image
                source={require("../assets/meow.jpg")}
                className="w-32 h-20 rounded mr-3 bg-gray-300"
                alt="meow"
              />
              <View className="flex-1">
                <Heading size="md" className="mb-1 text-white">
                  Meow Warriors
                </Heading>
              </View>
              <Ionicons name="play" size={28} color="#fff" className="ml-2" />
            </View>
          </Card>
          <Card size="md" variant="filled" className="bg-black">
            <View className="flex-row items-center">
              <Image
                source={require("../assets/meow.jpg")}
                className="w-32 h-20 rounded mr-3 bg-gray-300"
                alt="meow"
              />
              <View className="flex-1">
                <Heading size="md" className="mb-1 text-white">
                  Meow Warriors
                </Heading>
              </View>
              <Ionicons name="play" size={28} color="#fff" className="ml-2" />
            </View>
          </Card>
        </>
      )}
      {/* danh mục  */}
      <View className="flex-row mt-4">
        <View className="flex-1 p-1 right-2">
          <Button size="md" variant="solid" action="primary" className="w-48 h-28 p-0 overflow-hidden">
            <View className="relative w-full h-full justify-center items-center">
              <Image
                source={require("../assets/hi.jpg")}
                className="absolute w-full h-full left-0 top-0  z-0"
                resizeMode="cover"
                alt="meow-bg"
              />
              <View className="absolute w-full h-full left-0 top-0 bg-black/25  z-10" pointerEvents="none" />
              <ButtonText className="z-20 text-white font-extrabold text-xl">Anime</ButtonText>
            </View>
          </Button>
        </View>
        <View className="flex-1 p-1 left-1">
          <Button size="md" variant="solid" action="primary" className="w-48 h-28 p-0 overflow-hidden">
            <View className="relative w-full h-full justify-center items-center">
              <Image
                source={require("../assets/glory.jpg")}
                className="absolute w-full h-full left-0 top-0  z-0"
                resizeMode="cover"
                alt="meow-bg"
              />
              <View className="absolute w-full h-full left-0 top-0 bg-black/25  z-10" pointerEvents="none" />
              <ButtonText className="z-20 text-white font-extrabold text-xl">K-Drama</ButtonText>
            </View>
          </Button>
        </View>
      </View>
      <View className="flex-row mt-3">
        <View className="flex-1 p-1 right-2">
          <Button size="md" variant="solid" action="primary" className="w-48 h-28 p-0 overflow-hidden">
            <View className="relative w-full h-full justify-center items-center">
              <Image
                source={require("../assets/kid.jpg")}
                className="absolute w-full h-full left-0 top-0  z-0"
                resizeMode="cover"
                alt="meow-bg"
              />
              <View className="absolute w-full h-full left-0 top-0 bg-black/25  z-10" pointerEvents="none" />
              <ButtonText className="z-20 text-white font-extrabold text-xl">Pop-Kid</ButtonText>
            </View>
          </Button>
        </View>
        <View className="flex-1 p-1 left-1">
          <Button size="md" variant="solid" action="primary" className="w-48 h-28 p-0 overflow-hidden">
            <View className="relative w-full h-full justify-center items-center">
              <Image
                source={require("../assets/gameshow.jpg")}
                className="absolute w-full h-full left-0 top-0  z-0"
                resizeMode="cover"
                alt="meow-bg"
              />
              <View className="absolute w-full h-full left-0 top-0 bg-black/25  z-10" pointerEvents="none" />
              <ButtonText className="z-20 text-white font-extrabold text-xl">GameShow</ButtonText>
            </View>
          </Button>
        </View>
      </View>
      <View className="flex-row mt-3">
        <View className="flex-1 p-1 right-2">
          <Button size="md" variant="solid" action="primary" className="w-48 h-28 p-0 overflow-hidden">
            <View className="relative w-full h-full justify-center items-center">
              <Image
                source={require("../assets/dead.jpg")}
                className="absolute w-full h-full left-0 top-0  z-0"
                resizeMode="cover"
                alt="meow-bg"
              />
              <View className="absolute w-full h-full left-0 top-0 bg-black/25  z-10" pointerEvents="none" />
              <ButtonText className="z-20 text-white font-extrabold text-xl">Hành Động</ButtonText>
            </View>
          </Button>
        </View>
        <View className="flex-1 p-1 left-1">
          <Button size="md" variant="solid" action="primary" className="w-48 h-28 p-0 overflow-hidden">
            <View className="relative w-full h-full justify-center items-center">
              <Image
                source={require("../assets/Faker.jpg")}
                className="absolute w-full h-full left-0 top-0  z-0"
                resizeMode="cover"
                alt="meow-bg"
              />
              <View className="absolute w-full h-full left-0 top-0 bg-black/25  z-10" pointerEvents="none" />
              <ButtonText className="z-20 text-white font-extrabold text-xl">Thể Thao</ButtonText>
            </View>
          </Button>
        </View>
      </View>
      <View className="flex-row mt-3">
        <View className="flex-1 p-1 right-2">
          <Button size="md" variant="solid" action="primary" className="w-48 h-28 p-0 overflow-hidden">
            <View className="relative w-full h-full justify-center items-center">
              <Image
                source={require("../assets/larva.jpg")}
                className="absolute w-full h-full left-0 top-0  z-0"
                resizeMode="cover"
                alt="meow-bg"
              />
              <View className="absolute w-full h-full left-0 top-0 bg-black/25  z-10" pointerEvents="none" />
              <ButtonText className="z-20 text-white font-extrabold text-xl">Hài Hước</ButtonText>
            </View>
          </Button>
        </View>
        <View className="flex-1 p-1 left-1">
          <Button size="md" variant="solid" action="primary" className="w-48 h-28 p-0 overflow-hidden">
            <View className="relative w-full h-full justify-center items-center">
              <Image
                source={require("../assets/quaquyt.jpg")}
                className="absolute w-full h-full left-0 top-0  z-0"
                resizeMode="cover"
                alt="meow-bg"
              />
              <View className="absolute w-full h-full left-0 top-0 bg-black/25  z-10" pointerEvents="none" />
              <ButtonText className="z-20 text-white font-extrabold text-xl">Lãng mạn</ButtonText>
            </View>
          </Button>
        </View>
      </View>
      <View className="flex-row mt-3">
        <View className="flex-1 p-1 right-2">
          <Button size="md" variant="solid" action="primary" className="w-48 h-28 p-0 overflow-hidden">
            <View className="relative w-full h-full justify-center items-center">
              <Image
                source={require("../assets/zombie.jpg")}
                className="absolute w-full h-full left-0 top-0  z-0"
                resizeMode="cover"
                alt="meow-bg"
              />
              <View className="absolute w-full h-full left-0 top-0 bg-black/25  z-10" pointerEvents="none" />
              <ButtonText className="z-20 text-white font-extrabold text-xl">Kinh Dị</ButtonText>
            </View>
          </Button>
        </View>
        <View className="flex-1 p-1 left-1">
          <Button size="md" variant="solid" action="primary" className="w-48 h-28 p-0 overflow-hidden">
            <View className="relative w-full h-full justify-center items-center">
              <Image
                source={require("../assets/3d.jpg")}
                className="absolute w-full h-full left-0 top-0  z-0"
                resizeMode="cover"
                alt="meow-bg"
              />
              <View className="absolute w-full h-full left-0 top-0 bg-black/25  z-10" pointerEvents="none" />
              <ButtonText className="z-20 text-white font-extrabold text-xl">3D</ButtonText>
            </View>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
