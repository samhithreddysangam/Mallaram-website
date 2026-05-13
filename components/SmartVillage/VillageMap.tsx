'use client';

import { motion } from 'framer-motion';
import { MapPin, Box, Droplets, Trash2, Maximize2, Layers, Navigation2, ExternalLink } from 'lucide-react';
import { Locale, getDictionary } from '@/lib/i18n';

interface VillageMapProps {
  locale: Locale;
}

export default function VillageMap({ locale }: VillageMapProps) {
  const dictionary = getDictionary(locale);

  const landmarks = [
    { name: 'Panchayat Office', type: 'Govt', pos: 'top-[35%] left-[45%]', icon: MapPin },
    { name: 'Government School', type: 'Edu', pos: 'bottom-[40%] left-[55%]', icon: MapPin },
    { name: 'Health Center', type: 'Med', pos: 'top-[50%] right-[35%]', icon: MapPin },
    { name: 'Community Hall', type: 'Social', pos: 'bottom-[30%] right-[45%]', icon: MapPin },
  ];

  // Mallaram, Vemulawada, Telangana Coordinates
  const googleMapsUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15112.593685603774!2d78.8156!3d18.3863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcc715e754589d3%3A0xc39f860156d953f!2sMallaram%2C%20Telangana%20505403!5e1!3m2!1sen!2sin!4v1715580000000!5m2!1sen!2sin&maptype=satellite";
  const googleEarthUrl = "https://earth.google.com/web/search/Mallaram,+Telangana/@18.3863,78.8156,260.5a,1000d,35y,0h,0t,0r";

  return (
    <section id="map" className="py-32 bg-[#FAF9F6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#15803d]/10 text-[#15803d] text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-[#15803d]/20">
              <Layers className="w-3 h-3" />
              GIS Visualization
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-[#0A0A0A] mb-8 tracking-tighter uppercase leading-[0.85]">
              Village <span className="text-[#15803d]">Spatial</span> Map
            </h2>
            <p className="text-gray-600 text-lg font-medium leading-relaxed">
              Interactive GIS layout of Mallaram village. Explore key landmarks, infrastructure nodes, and developmental projects in real-time satellite view.
            </p>
          </motion.div>

          <motion.a
            href={googleEarthUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-4 px-10 py-6 bg-[#0A0A0A] text-white rounded-[2rem] shadow-2xl group transition-all"
          >
            <div className="p-3 rounded-xl bg-white/10 group-hover:bg-[#15803d] transition-colors">
              <Navigation2 className="w-6 h-6 rotate-45" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Open 3D Experience</div>
              <div className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                Launch Google Earth
                <ExternalLink className="w-4 h-4 opacity-40" />
              </div>
            </div>
          </motion.a>
        </div>

        <div className="relative aspect-[21/9] w-full bg-white rounded-[3rem] md:rounded-[5rem] border border-gray-100 shadow-[0_40px_100px_rgba(0,0,0,0.08)] overflow-hidden group">
          {/* Real Google Map Iframe */}
          <iframe
            src={googleMapsUrl}
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'contrast(1.1) brightness(0.9) saturate(1.2)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000"
          />

          {/* Map Overlay Vignette */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0A0A0A]/20 to-transparent" />

          {/* Dynamic Landmarks Pins (Interactive Layers) */}
          {landmarks.map((mark, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 + 0.5, type: 'spring' }}
              className={`absolute ${mark.pos} flex flex-col items-center group/mark z-20`}
            >
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-[#15803d]/40 scale-150" />
                <div className="relative w-12 h-12 rounded-2xl bg-white border-2 border-[#15803d] shadow-2xl flex items-center justify-center text-[#15803d] group-hover/mark:bg-[#15803d] group-hover/mark:text-white transition-all duration-500 cursor-pointer">
                  <mark.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 px-6 py-3 bg-[#0A0A0A] text-white rounded-2xl border border-white/10 shadow-2xl opacity-0 group-hover/mark:opacity-100 transition-all duration-500 whitespace-nowrap -translate-y-2 group-hover/mark:translate-y-0">
                <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{mark.name}</p>
                <div className="h-[1px] w-full bg-white/20 mb-1" />
                <p className="text-[8px] font-bold text-[#15803d] uppercase tracking-widest">Active Station</p>
              </div>
            </motion.div>
          ))}

          {/* GIS Controls Overlay */}
          <div className="absolute top-8 right-8 flex flex-col gap-3 z-30">
            {[Maximize2, Layers, MapPin].map((Icon, i) => (
              <button key={i} className="p-4 bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-xl hover:bg-[#15803d] hover:text-white transition-all">
                <Icon className="w-5 h-5" />
              </button>
            ))}
          </div>

          {/* Legend Overlay */}
          <div className="absolute bottom-10 left-10 p-8 md:p-10 bg-[#0A0A0A]/90 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl space-y-6 max-w-xs z-30">
            <h4 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              <Box className="w-5 h-5 text-[#15803d]" />
              Map Legend
            </h4>
            <div className="space-y-4">
              {[
                { label: 'Government Hubs', color: 'bg-[#15803d]', icon: MapPin },
                { label: 'Water Resources', color: 'bg-blue-500', icon: Droplets },
                { label: 'Infrastructure', color: 'bg-amber-500', icon: Trash2 }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group/item">
                  <div className={`p-2 rounded-lg ${item.color} group-hover/item:scale-110 transition-transform`}>
                    <item.icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover/item:text-white transition-colors">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
