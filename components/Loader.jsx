// components/Loader.jsx
export default function Loader() {
  return (
    <div className="fixed inset-0 bg-white/80 z-[1000] flex items-center justify-center">
      <div className="w-14 h-14 border-4 border-[#E3C396] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
