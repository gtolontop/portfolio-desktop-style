'use client'

import BaseApp from './templates/BaseApp'

export default function AboutMe() {
  return (
    <BaseApp title="À propos de moi">
      <div className="p-6 text-gray-300">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">John Doe</h1>
            <p className="text-xl text-pink-400">Développeur Full Stack</p>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Présentation</h2>
              <p className="leading-relaxed">
                Passionné par le développement web et les nouvelles technologies,
                je crée des applications modernes et performantes. Mon expertise
                s'étend du front-end au back-end, avec une attention particulière
                pour l'expérience utilisateur et les interfaces intuitives.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Compétences</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-pink-400 mb-2">Frontend</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• React / Next.js</li>
                    <li>• TypeScript</li>
                    <li>• Tailwind CSS</li>
                    <li>• Vue.js</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-pink-400 mb-2">Backend</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Node.js</li>
                    <li>• Python</li>
                    <li>• PostgreSQL</li>
                    <li>• MongoDB</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
              <div className="space-y-2 text-sm">
                <p>📧 Email: john.doe@example.com</p>
                <p>🔗 LinkedIn: linkedin.com/in/johndoe</p>
                <p>💻 GitHub: github.com/johndoe</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </BaseApp>
  )
}