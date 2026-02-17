import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../lib/cropImage";
import PrimaryButton from "./PrimaryButton";

type Props = {
    image: string;
    onConfirm: (croppedBlob: Blob) => void;
    onCancel: () => void;
};

export default function AvatarCropper({ image, onConfirm, onCancel }: Props) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleConfirm = async () => {
        try {
            const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
            if (croppedBlob) {
                onConfirm(croppedBlob);
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex flex-col bg-black">
            <div className="relative flex-1">
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            </div>

            <div className="p-6 bg-white rounded-t-[32px] space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase ml-1">Zoom</label>
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e: any) => setZoom(Number(e.target.value))}
                        className="w-full h-2 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-sun-500"
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-4 text-sm font-black text-neutral-500 hover:text-neutral-800 transition"
                    >
                        Cancelar
                    </button>
                    <div className="flex-1">
                        <PrimaryButton onClick={handleConfirm}>
                            Confirmar Corte
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
